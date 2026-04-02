import {
	detectEmbedType,
	extractYouTubeId,
	extractGitHubGistId,
	extractTwitterId,
	extractCodePenId,
} from "~/lib/markdown/embed";

interface EmbedRendererProps {
	url: string;
}

function YouTubeEmbed({ url }: { url: string }) {
	const videoId = extractYouTubeId(url);
	if (!videoId) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary hover:underline"
			>
				{url}
			</a>
		);
	}

	return (
		<div className="my-4 aspect-video w-full overflow-hidden rounded-lg">
			<iframe
				src={`https://www.youtube.com/embed/${videoId}`}
				width="100%"
				height="400"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				loading="lazy"
				title={`YouTube video ${videoId}`}
				className="h-full w-full"
			/>
		</div>
	);
}

function GitHubGistEmbed({ url }: { url: string }) {
	const gistData = extractGitHubGistId(url);
	if (!gistData) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary hover:underline"
			>
				{url}
			</a>
		);
	}

	const { user, gistId } = gistData;

	return (
		<div className="my-4 overflow-hidden rounded-lg border border-border">
			<script
				src={`https://gist.github.com/${user}/${gistId}.js`}
				async
			/>
			<noscript>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary hover:underline"
				>
					View Gist on GitHub
				</a>
			</noscript>
		</div>
	);
}

function TwitterEmbed({ url }: { url: string }) {
	const tweetId = extractTwitterId(url);
	if (!tweetId) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary hover:underline"
			>
				{url}
			</a>
		);
	}

	return (
		<div className="my-4">
			<blockquote className="twitter-tweet" data-theme="light">
				<a href={url}>View tweet</a>
			</blockquote>
			<script
				async
				src="https://platform.twitter.com/widgets.js"
				charSet="utf-8"
			/>
			<noscript>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary hover:underline"
				>
					View on X (Twitter)
				</a>
			</noscript>
		</div>
	);
}

function CodePenEmbed({ url }: { url: string }) {
	const penData = extractCodePenId(url);
	if (!penData) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary hover:underline"
			>
				{url}
			</a>
		);
	}

	const { user, pen } = penData;

	return (
		<div className="my-4 overflow-hidden rounded-lg border border-border">
			<iframe
				src={`https://codepen.io/${user}/embed/${pen}?default-tab=result`}
				width="100%"
				height="400"
				frameBorder="0"
				allowFullScreen
				loading="lazy"
				title={`CodePen by ${user}`}
				className="w-full"
			/>
		</div>
	);
}

export function EmbedRenderer({ url }: EmbedRendererProps) {
	const type = detectEmbedType(url);

	switch (type) {
		case "youtube":
			return <YouTubeEmbed url={url} />;
		case "github":
			return <GitHubGistEmbed url={url} />;
		case "twitter":
			return <TwitterEmbed url={url} />;
		case "codepen":
			return <CodePenEmbed url={url} />;
		default:
			return (
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary hover:underline"
				>
					{url}
				</a>
			);
	}
}