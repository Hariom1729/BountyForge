import { Octokit } from "octokit";

export const getOctokit = (accessToken?: string) => {
  return new Octokit({
    auth: accessToken || process.env.GITHUB_ACCESS_TOKEN,
  });
};

export const verifyGitHubWebhookSignature = async (
  signature: string,
  payload: string,
  secret: string
) => {
  const crypto = await import("crypto");
  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
