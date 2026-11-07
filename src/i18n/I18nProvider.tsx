import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import strings from '../data/strings.json';
import artifactsBn from '../data/artifacts.bn.json';
import { MissionArtifact } from '../types/mission';

export type Lang = 'en' | 'bn';

type StringKey = keyof typeof strings.en;

/** Artifact fields that have a Bangla translation in artifacts.bn.json. */
export type TranslatableField =
  | 'role'
  | 'statusDescription'
  | 'story'
  | 'whyLeftBehind'
  | 'imageCaption'
  | 'locationName'
  | 'orbitalCaption';

type ArtifactBn = Partial<Record<TranslatableField, string>> & { scienceContribution?: string[] };

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /** UI string by key, with {placeholders} filled from vars. Falls back to English, then the key. */
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
  /** A translated artifact text field (falls back to the English original). */
  tx: (artifact: MissionArtifact, field: TranslatableField) => string;
  /** Translated "science made possible" list. */
  txScience: (artifact: MissionArtifact) => string[];
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'anf-lang';

const readInitialLang = (): Lang => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'bn' || saved === 'en') return saved;
  } catch {
    /* storage unavailable (private mode): ignore */
  }
  return 'en';
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => {
      const table = strings[lang] as Record<string, string>;
      let text = table[key] ?? (strings.en as Record<string, string>)[key] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) text = text.split(`{${name}}`).join(String(value));
      }
      return text;
    },
    [lang]
  );

  const tx = useCallback(
    (artifact: MissionArtifact, field: TranslatableField) => {
      if (lang === 'bn') {
        const entry = (artifactsBn as Record<string, ArtifactBn>)[artifact.id];
        const value = entry?.[field];
        if (value) return value;
      }
      if (field === 'orbitalCaption') return artifact.orbitalView?.caption ?? '';
      return artifact[field] as string;
    },
    [lang]
  );

  const txScience = useCallback(
    (artifact: MissionArtifact) => {
      if (lang === 'bn') {
        const list = (artifactsBn as Record<string, ArtifactBn>)[artifact.id]?.scienceContribution;
        if (list && list.length) return list;
      }
      return artifact.scienceContribution;
    },
    [lang]
  );

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, toggleLang: () => setLang((l) => (l === 'en' ? 'bn' : 'en')), t, tx, txScience }),
    [lang, t, tx, txScience]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
};
