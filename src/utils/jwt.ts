import jwt, { type JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/config.js";

interface signTokenPayload {
  user_id: string;
  email: string;
}

const secret = ENV.JWT_SECRET;
const refresh_secret = ENV.JWT_REFRESH_SECRET;

export const signToken = async (
  payload: signTokenPayload,
  refreshToken: boolean
) => {
  try {
    const token = jwt.sign(payload, secret, { expiresIn: "30m" });
    if (!token) {
      return new Error("Error signing token");
    }
    let newRefreshToken;
    if (refreshToken) {
      newRefreshToken = await signRefreshToken(payload);
    }
    if (newRefreshToken instanceof Error || !newRefreshToken)
      return new Error("Error signing refresh token" + refreshToken);
    return { token, newRefreshToken };
  } catch (error) {
    return new Error("Error signing token: " + error);
  }
};

export const signRefreshToken = async (payload: signTokenPayload) => {
  try {
    const refreshToken = jwt.sign(payload, refresh_secret, { expiresIn: "7d" });
    if (!refreshToken) {
      return new Error("Error signing token");
    }
    return refreshToken;
  } catch (error) {
    return new Error("Error signing token: " + error);
  }
};

export const verifyRefreshToken = async (
  token: string
): Promise<{ valid: boolean; expired: boolean; decoded: any }> => {
  try {
    const decoded = jwt.verify(token, refresh_secret) as JwtPayload;
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return { valid: false, expired: true, decoded: null };
  }
};

export const verifyToken = async (
  token: string
): Promise<{ valid: boolean; expired: boolean; decoded: any }> => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return { valid: true, expired: false, decoded };
  } catch (error: any) {
    return { valid: false, expired: true, decoded: null };
  }
};
