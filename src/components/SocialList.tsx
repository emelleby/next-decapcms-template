import React from "react";
import Twitter from "../assets/twitter-alt.svg";
import GitHub from "../assets/github-alt.svg";
import config from "../lib/config";

export function SocialList({}) {
  return (
    <div className="flex items-center justify-center gap-8">
      <a
        title="Twitter"
        href={`https://twitter.com/${config.twitter_account}`}
        target="_blank"
        rel="noopener"
        className="transition-colors hover:text-muted-foreground"
      >
        <Twitter width={24} height={24} fill="currentColor" />
      </a>
      <a
        title="GitHub"
        href={`https://github.com/${config.github_account}`}
        target="_blank"
        rel="noopener"
        className="transition-colors hover:text-muted-foreground"
      >
        <GitHub width={24} height={24} fill="currentColor" />
      </a>
    </div>
  );
}
