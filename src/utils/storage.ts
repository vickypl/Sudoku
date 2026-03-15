export const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const saveJson = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
