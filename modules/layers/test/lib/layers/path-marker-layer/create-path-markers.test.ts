import createPathMarkers from '../../../../src/layers/path-marker-layer/create-path-markers';

const data = [
  {
    path: [
      [-122.419385, 37.775412],
      [-122.4196034, 37.7753836],
      [-122.419815, 37.775356],
      [-122.4199019, 37.7753448],
      [-122.420337, 37.775289],
      [-122.420432, 37.7752776],
    ],
    direction: {
      forward: true,
      backward: false,
    },
  },
  {
    path: [
      [-122.4239121, 37.7739008],
      [-122.424018, 37.773888],
    ],
    direction: {
      forward: false,
      backward: false,
    },
  },
  {
    path: [
      [-122.419556, 37.776966],
      [-122.419631, 37.777297],
    ],
    direction: {
      forward: true,
      backward: false,
    },
  },
  {
    path: [
      [-122.4232649, 37.7715712],
      [-122.4231892, 37.7714474],
      [-122.4230516, 37.7712495],
      [-122.4229364, 37.7711068],
      [-122.4228177, 37.7709811],
      [-122.4226595, 37.770835],
      [-122.4225099, 37.7707146],
      [-122.4224446, 37.7706699],
    ],
    direction: {
      forward: true,
      backward: false,
    },
  },
  {
    path: [
      [-122.421459, 37.7756509],
      [-122.4214451, 37.7755683],
      [-122.4214282, 37.7755459],
      [-122.4213833, 37.7755382],
      [-122.4212633, 37.7755543],
    ],
    direction: {
      forward: false,
      backward: false,
    },
  },
  {
    path: [
      [-122.41515, 37.77588],
      [-122.415508, 37.775601],
    ],
    direction: {
      forward: false,
      backward: false,
    },
  },
  {
    path: [
      [-122.417263, 37.7763419],
      [-122.417163, 37.776264],
      [-122.4169496, 37.7761011],
    ],
    direction: {
      forward: true,
      backward: false,
    },
  },
  {
    path: [
      [-122.4205054, 37.7733851],
      [-122.4203894, 37.773298],
    ],
    direction: {
      forward: false,
      backward: false,
    },
  },
  {
    path: [
      [-122.4245033, 37.7762476],
      [-122.4244959, 37.7762071],
    ],
    direction: {
      forward: false,
      backward: false,
    },
  },
  {
    path: [
      [-122.415898, 37.777819],
      [-122.416311, 37.777494],
    ],
    direction: {
      forward: false,
      backward: false,
    },
  },
];

it('test createPathMarkers', () => {
  const result = createPathMarkers({ data, projectFlat: (x) => x });
  expect(result).toMatchSnapshot();
});
