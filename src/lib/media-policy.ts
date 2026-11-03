export type MediaConnection = {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
};

/** Capacity selects file size; only explicit browser preferences stop autoplay. */
export function mediaPolicy({
  wide,
  reduced = false,
  cores,
  memory,
  connection,
}: {
  wide: boolean;
  reduced?: boolean;
  cores?: number;
  memory?: number;
  connection?: MediaConnection;
}) {
  const slow = Boolean(
    connection?.saveData ||
    /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || '') ||
    (connection?.downlink !== undefined && connection.downlink < 2.5) ||
    (connection?.rtt !== undefined && connection.rtt > 500),
  );
  const limited =
    (cores !== undefined && cores <= 4) ||
    (memory !== undefined && memory <= 4);
  const premium =
    !slow &&
    !limited &&
    (cores || 0) >= 6 &&
    (connection?.downlink === undefined || connection.downlink >= 6);
  return {
    autoplay: !reduced && !connection?.saveData,
    profile: wide
      ? premium
        ? 'desktop'
        : 'balanced'
      : premium
        ? 'mobile'
        : 'lite',
    richMotion: premium && !reduced,
  };
}
