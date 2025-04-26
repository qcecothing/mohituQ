export type TrajectoryData = {
  is_polar_trajectory: boolean;
  latitudes_inland: Array<number>;
  latitudes_offshore: Array<number>;
  latitudes_shore: Array<number>;
  longitudes_inland: Array<number>;
  longitudes_offshore: Array<number>;
  longitudes_shore: Array<number>;
  particle_id: number;
  probability: number;
  times_inland: Array<number>;
  times_offshore: Array<number>;
  trajectory_center_lat: number;
  trajectory_center_lon: number;
  travelled_distance: number;
};
