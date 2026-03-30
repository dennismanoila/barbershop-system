import { findBarbers } from "../repositories/userRepository";

export const getBarbers = async () => {
  return findBarbers();
};
