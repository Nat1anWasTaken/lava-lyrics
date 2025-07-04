import type { ApiLyricsInfo, FilterRequest, GuildId, LoopMode, PlayerState, PlayRequest, QueueInfo, SkipRequest, TrackIndex, TrackInfo, VolumeRequest } from "./types";

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        message?: string
    ) {
        super(message || `API request failed: ${status} ${statusText}`);
        this.name = "ApiError";
    }
}

export class LavaLyricsAPI {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `/.proxy/api${endpoint}`;

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new ApiError(response.status, response.statusText);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    async getRoot(): Promise<unknown> {
        return this.request("/");
    }

    async getGuilds(): Promise<unknown> {
        return this.request("/guilds");
    }

    async getPlayerState(guildId: GuildId): Promise<PlayerState> {
        return this.request(`/player/${guildId}`);
    }

    async getNowPlaying(guildId: GuildId): Promise<TrackInfo | null> {
        return this.request(`/player/${guildId}/nowplaying`);
    }

    async getQueue(guildId: GuildId, limit = 50): Promise<QueueInfo> {
        return this.request(`/player/${guildId}/queue?limit=${limit}`);
    }

    async clearQueue(guildId: GuildId): Promise<void> {
        return this.request(`/player/${guildId}/queue`, {
            method: "DELETE"
        });
    }

    async removeTrack(guildId: GuildId, trackIndex: TrackIndex): Promise<void> {
        return this.request(`/player/${guildId}/queue/${trackIndex}`, {
            method: "DELETE"
        });
    }

    async getLyrics(guildId: GuildId): Promise<ApiLyricsInfo> {
        return this.request(`/player/${guildId}/lyrics`);
    }

    async getCurrentLyrics(guildId: GuildId, rangeSeconds = 5.0): Promise<ApiLyricsInfo> {
        return this.request(`/player/${guildId}/lyrics/current?range_seconds=${rangeSeconds}`);
    }

    async toggleLyrics(guildId: GuildId): Promise<void> {
        return this.request(`/player/${guildId}/lyrics/toggle`, {
            method: "POST"
        });
    }

    async playTrack(guildId: GuildId, playRequest: PlayRequest): Promise<void> {
        return this.request(`/player/${guildId}/play`, {
            method: "POST",
            body: JSON.stringify(playRequest)
        });
    }

    async pausePlayer(guildId: GuildId): Promise<void> {
        return this.request(`/player/${guildId}/pause`, {
            method: "POST"
        });
    }

    async resumePlayer(guildId: GuildId): Promise<void> {
        return this.request(`/player/${guildId}/resume`, {
            method: "POST"
        });
    }

    async stopPlayer(guildId: GuildId): Promise<void> {
        return this.request(`/player/${guildId}/stop`, {
            method: "POST"
        });
    }

    async skipTrack(guildId: GuildId, skipRequest: SkipRequest = {}): Promise<void> {
        return this.request(`/player/${guildId}/skip`, {
            method: "POST",
            body: JSON.stringify(skipRequest)
        });
    }

    async setVolume(guildId: GuildId, volume: number): Promise<void> {
        const volumeRequest: VolumeRequest = { volume };
        return this.request(`/player/${guildId}/volume`, {
            method: "POST",
            body: JSON.stringify(volumeRequest)
        });
    }

    async toggleShuffle(guildId: GuildId, enabled: boolean): Promise<void> {
        return this.request(`/player/${guildId}/shuffle?enabled=${enabled}`, {
            method: "POST"
        });
    }

    async setLoopMode(guildId: GuildId, mode: LoopMode): Promise<void> {
        return this.request(`/player/${guildId}/loop?mode=${mode}`, {
            method: "POST"
        });
    }

    async toggleAutoplay(guildId: GuildId, enabled: boolean): Promise<void> {
        return this.request(`/player/${guildId}/autoplay?enabled=${enabled}`, {
            method: "POST"
        });
    }

    async getFilters(guildId: GuildId): Promise<unknown> {
        return this.request(`/player/${guildId}/filters`);
    }

    async setFilter(guildId: GuildId, filterRequest: FilterRequest): Promise<void> {
        return this.request(`/player/${guildId}/filters`, {
            method: "POST",
            body: JSON.stringify(filterRequest)
        });
    }
}
