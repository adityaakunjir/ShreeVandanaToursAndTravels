export type MediaConnection = {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
};

/** Constrained connections and hardware show the destination poster. */
export function mediaPolicy({
  wide,
  reduced = false,
  cores,
  memory,
  connection,
  fourK = false,
}: {
  wide: boolean;
  reduced?: boolean;
  cores?: number;
  memory?: number;
  connection?: MediaConnection;
  fourK?: boolean;
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
    autoplay: !reduced && !slow && !limited,
    profile: wide
      ? slow
        ? 'economy'
        : premium
          ? fourK &&
            (cores || 0) >= 8 &&
            (memory || 0) >= 8 &&
            (connection?.downlink || 0) >= 15
            ? '4k'
            : 'desktop'
          : 'balanced'
      : premium
        ? 'mobile'
        : 'lite',
    richMotion: premium && !reduced,
  };
}
