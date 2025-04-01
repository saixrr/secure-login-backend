const challenges = new Map();

export const saveChallengeForUser = (username, challenge) => {
  challenges.set(username, { challenge, used: false });
};

export const getChallengeForUser = (username) => challenges.get(username);

export const markChallengeUsed = (username) => {
  const c = challenges.get(username);
  if (c) c.used = true;
};
