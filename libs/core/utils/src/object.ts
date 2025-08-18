/**
 * A typed version of Object.keys.
 * Get the keys of an object.
 * @param obj - The object to get the keys of.
 * @returns The keys of the object.
 */
export const keys = <T extends object>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];