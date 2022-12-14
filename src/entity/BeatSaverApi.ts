export interface BeatSaverApi {
    automapper: boolean;
    createdAt: string;
    curatedAt: string;
    curator: BeatSaverUserDetail;
    deletedAt: string;
    description: string;
    id: string;
    lastPublishedAt: string;
    metadata: BeatSaverMetadata;
    name: string;
    qualified: boolean;
    ranked: boolean;
    stats: BeatSaverStats;
    tags: string[];
    updatedAt: string;
    uploadedAt: string;
    uploader: BeatSaverUserDetail;
    versions: BeatSaverVersion[];
}

interface BeatSaverUserDetail {
    avatar: string;
    curator: boolean;
    email: string;
    following: boolean;
    hash: string;
    id: number;
    name: string;
    stats: BeatSaverUserStats;
    testplay: boolean;
    type: string;
    uniqueSet: boolean;
    uploadLimit: number;
    verifiedMapper: boolean;
}

interface BeatSaverUserStats {
    avgBpm: number;
    avgDuration: number;
    avgScore: number;
    diffStats: BeatSaverDiffStats;
    firstUpload: string;
    lastUpload: string;
    rankedMaps: number;
    totalDownvotes: number;
    totalMaps: number;
    totalUpvotes: number;
}

interface BeatSaverDiffStats {
    easy: number;
    expert: number;
    expertPlus: number;
    hard: number;
    normal: number;
    total: number;
}

interface BeatSaverMetadata {
    bpm: number;
    duration: number;
    levelAuthorName: string;
    songAuthorName: string;
    songName: string;
    songSubName: string;
}

interface BeatSaverVersion {
    coverURL: string;
    createdAt: string;
    diffs: BeatSaverDiff[];
    downloadURL: string;
    feedback: string;
    hash: string;
    key: string;
    previewURL: string;
    sageScore: number;
    scheduledAt: string;
    state: string;
    testplayAt: string;
    testplays: BeatSaverTestplay[];
}

interface BeatSaverTestplay {
    createdAt: string;
    feedback: string;
    feedbackAt: string;
    user: BeatSaverUserDetail;
    video: string;
}

interface BeatSaverDiff {
    bombs: number;
    characteristic: string;
    chroma: boolean;
    cinema: boolean;
    difficulty: string;
    events: number;
    length: number;
    maxScore: number;
    me: boolean;
    ne: boolean;
    njs: number;
    notes: number;
    nps: number;
    obstacles: number;
    offset: number;
    paritySummary: BeatSaverParitySummary;
    seconds: number;
    stars: number;
}

interface BeatSaverParitySummary {
    errors: number;
    resets: number;
    warns: number;
}

interface BeatSaverStats {
    downloads: number;
    downvotes: number;
    plays: number;
    score: number;
    scoreOneDp: number;
    upvotes: number;
}