import axios from "axios";

export const getLeaderboard = async (age, country) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/leaderboard`,
      {
        params: {
          age: age || undefined,
          country: country || undefined,
        },
      }
    );

    return response.data.leaderboard;
  } catch (error) {
    throw error;
  }
};

export const getLeaderboardforUser = async (username) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/${username}`
  );
  return response.data.userData;
};
