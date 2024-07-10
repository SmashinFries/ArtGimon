export const secToMinString = (seconds: number) =>
	`${Math.floor(Math.round(seconds) / 60)
		.toFixed(0)
		.padStart(2, '0')}:${(Math.round(seconds) % 60).toFixed(0).padStart(2, '0')}`;
