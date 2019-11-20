export const normalizeString = (str: string) => str.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ' ').replace(/\s+/g, '');
