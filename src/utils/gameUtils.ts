export const getGameImage = (thumb: string | null | undefined): string => {
    // Вимога: якщо картинки немає, повернути заглушку
    if (!thumb || thumb.trim() === '') {
      return '/assets/default-placeholder.png';
    }
    return thumb;
  };