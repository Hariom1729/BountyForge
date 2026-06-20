import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "MAINTAINER") {
      return NextResponse.json({ error: "Unauthorized. Must be a maintainer." }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Parse GitHub URL: https://github.com/owner/repo/issues/123
    const regex = /github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/;
    const match = url.match(regex);

    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub Issue URL" }, { status: 400 });
    }

    const [, owner, repo, issueNumber] = match;

    // Fetch from GitHub API
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "BountyForge",
    };

    if (process.env.GITHUB_ACCESS_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`;
    }

    const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
      headers,
    });

    if (!githubRes.ok) {
      return NextResponse.json({ error: "Failed to fetch issue from GitHub. Make sure it is public." }, { status: 404 });
    }

    const issueData = await githubRes.json();

    // Upsert Repository
    const repository = await prisma.repository.upsert({
      where: {
        githubId: issueData.repository_url.split('/').pop() || `${owner}/${repo}`, // Approximate, normally you'd fetch repo ID
      },
      update: {},
      create: {
        githubId: issueData.repository_url.split('/').pop() || `${owner}/${repo}`,
        name: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        ownerId: session.user.id, // Assign the maintainer as the owner for now
      },
    });

    // Upsert Issue
    const issue = await prisma.issue.upsert({
      where: {
        githubIssueId: issueData.id.toString(),
      },
      update: {
        title: issueData.title,
        body: issueData.body || "",
        state: issueData.state === "open" ? "OPEN" : "CLOSED",
      },
      create: {
        githubIssueId: issueData.id.toString(),
        number: issueData.number,
        title: issueData.title,
        body: issueData.body || "",
        state: issueData.state === "open" ? "OPEN" : "CLOSED",
        url: issueData.html_url,
        repositoryId: repository.id,
      },
    });

    return NextResponse.json({
      issueId: issue.id,
      title: issue.title,
      repository: repository.name,
      number: issue.number,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching GitHub issue:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
