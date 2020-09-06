export class PerformanceTracker {
    protected last_time_stamp: number = 0;
    protected frame_count: number = 0;
    public current_fps: number = 1;

    public constructor() {
        this.last_time_stamp = performance.now();
    }
    public update() {
        this.frame_count++;
        const now = performance.now();
        if (now > this.last_time_stamp + 1000) {
            this.last_time_stamp = now;
            this.current_fps = this.frame_count;
            this.frame_count = 0;
        }
    }

}