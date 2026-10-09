import test from 'node:test';
import assert from 'node:assert/strict';
import { computerPose, focusCardPose, desktopStop, processIndex, processPose, workIndex, workPose, workStops } from '../src/lib/editorial-timeline.ts';

test('projects have long, stable reading intervals and working navigation stops', () => {
  workStops.forEach((p, index) => {
    assert.equal(workIndex(p), index);
    assert.equal(workPose(p, index).y, 0);
    assert.equal(workPose(p, index).rotation, 0);
    assert.deepEqual(workPose(p - .04, index), workPose(p + .04, index));
  });
});
test('every process card arrives and then holds', () => {
  for (let i = 0; i < 4; i++) {
    assert.ok(processPose(.8, i).height >= 62);
    assert.equal(processPose(.8, i).mobileY, 0);
    assert.deepEqual(processPose(.8, i), processPose(1, i));
  }
});
test('focus and tickets precede the monitor and desktop', () => {
  assert.equal(computerPose(.06).focusOpacity, 1);
  assert.equal(computerPose(.06).focusBlur, 0);
  assert.equal(computerPose(.16).focusBlur, 5);
  assert.equal(computerPose(.16).emphasisBlur, 0);
  for (const p of [.06, .16, .30, .50, .56, .62]) {
    assert.equal(computerPose(p).monitorOpacity, 0);
    assert.equal(computerPose(p).desktopOpacity, 0);
  }
  assert.equal(computerPose(.70).presentationOpacity, 0);
  assert.equal(computerPose(.70).monitorOpacity, 1);
  assert.equal(computerPose(.70).zoom, 0);
  assert.equal(computerPose(.70).desktopOpacity, 0);
  assert.ok(computerPose(.82).monitorScale > computerPose(.70).monitorScale);
  assert.equal(computerPose(desktopStop).monitorOpacity, 0);
  assert.equal(computerPose(desktopStop).desktopOpacity, 1);
  assert.equal(computerPose(desktopStop).interactive, true);
});
test('cards flip in order and hold before the computer enters', () => {
  assert.equal(focusCardPose(.29, 0).rotation, 0);
  assert.ok(focusCardPose(.29, 1).rotation > 0);
  assert.ok(focusCardPose(.29, 2).rotation > focusCardPose(.29, 1).rotation);
  for (let i = 0; i < 3; i++) {
    assert.deepEqual(focusCardPose(.46, i), { y: 0, rotation: 0 });
    assert.deepEqual(focusCardPose(.46, i), focusCardPose(.56, i));
  }
});
test('all poses reverse deterministically and clamp outside the timeline', () => {
  const positions = [0, .05, .24, .35, .5, .75, 1];
  const snapshots = positions.map(computerPose);
  [...positions].reverse().forEach((p, i) => assert.deepEqual(computerPose(p), snapshots[snapshots.length - 1 - i]));
  assert.deepEqual(computerPose(-1), computerPose(0));
  assert.deepEqual(computerPose(2), computerPose(1));
});

test('mobile process focus follows fully arrived cards', () => {
  [.1, .3, .55, .8].forEach((p, index) => {
    assert.equal(processIndex(p), index);
    assert.equal(processPose(p, index).mobileY, 0);
  });
});

test('mobile tickets each have a readable hold before the next arrives', () => {
  [.24, .345, .45].forEach((p, index) => {
    assert.deepEqual(focusCardPose(p, index, true), { y: 0, rotation: 0 });
    if (index < 2) assert.equal(focusCardPose(p, index + 1, true).rotation, 180);
  });
});
