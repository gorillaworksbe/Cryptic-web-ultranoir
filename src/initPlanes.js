// const psd = {
//   w: 1680,
//   h: 992
// };
const mainPlane = {
  x: 936,
  y: 144,
  width: 520,
  height: 676,
  points: {
    hori: 18,
    vert: 14
  },
  // margin between row/columns
  margin: {
    x: 120,
    y: 100
  }
};

function initPlanes() {
  const planes = [];
  // The total space the plane occupies. Includes margin
  const spaceX = mainPlane.width + mainPlane.margin.x;
  const spaceY = mainPlane.height + mainPlane.margin.x;

  // Since we are going to add all the planes in a single array.
  // We need to keep track of the index
  let index = 0;
  // Right hand column
  const rightColX = mainPlane.x;
  const rightColY = mainPlane.y;
  for (var i = 0; i < 5; i++) {
    let offsetY = i - 2;
    planes[index] = {
      x: rightColX,
      y: rightColY + spaceY * offsetY,
      width: mainPlane.width,
      height: mainPlane.height,
      points: mainPlane.points
    };
    index++;
  }

  let middleColX = mainPlane.x - spaceX;
  let middleColY = -350 + mainPlane.y;
  for (var j = 0; j < 4; j++) {
    let offsetY = j - 1;
    planes[index] = {
      x: middleColX,
      y: middleColY + spaceY * offsetY,
      width: mainPlane.width,
      height: mainPlane.height,
      points: mainPlane.points
    };
    index++;
  }

  const leftColX = mainPlane.x - 2 * spaceX;
  const leftColY = rightColY;
  for (var k = 0; k < 5; k++) {
    // this -2 will make the y start 2 rows above
    // Since its the same as the first(right) column, they start at the same place
    // basically offsetY
    let offsetY = k - 2;

    planes[index] = {
      x: leftColX,
      y: leftColY + spaceY * offsetY,
      width: mainPlane.width,
      height: mainPlane.height,
      points: mainPlane.points
    };
    index++;
  }

  return { planes, spaceY };
}

export { initPlanes };
