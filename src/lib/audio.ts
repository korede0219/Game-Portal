/**
 * Immersive Web Audio Synthesizer for the Console-Style Game Portal
 * Optimized for professional, high-fidelity tactile clicks, ticks, and micro-haptics.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 1. playHoverSound: A very subtle micro-tick (like a premium mechanical dial or pointer click).
 * Extremely short duration (12ms) and high frequency.
 */
export function playHoverSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    // Ultra-fast frequency sweep from 2400Hz down to 1200Hz
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.012);

    // Exponentially drop gain to zero in 12ms
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch (e) {
    // Suppress interaction warnings gracefully
  }
}

/**
 * 2. playSelectSound: A tactile, high-fidelity double-click/snap (like a high-end gamepad button press).
 * Two micro-ticks spaced 35ms apart.
 */
export function playSelectSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First click (the press trigger)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1800, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.015);
    gain1.gain.setValueAtTime(0.07, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    // Second click (rebound/latch trigger, 35ms later, slightly lower pitch)
    const clickDelay = 0.035;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1500, now + clickDelay);
    osc2.frequency.exponentialRampToValueAtTime(700, now + clickDelay + 0.01);
    gain2.gain.setValueAtTime(0.05, now + clickDelay);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + clickDelay + 0.01);

    osc1.start(now);
    osc1.stop(now + 0.02);
    
    osc2.start(now + clickDelay);
    osc2.stop(now + clickDelay + 0.02);
  } catch (e) {}
}

/**
 * 3. playFavoriteSound: A shimmering mechanical ratchet click or high-end dynamic tick sequence.
 * Spaced out beautifully like glass shards brushing together.
 */
export function playFavoriteSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 3 ultra-crisp glassy high ticks
    [0, 0.04, 0.08].forEach((delay, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      // Ascending premium chime frequencies
      const freqs = [2800, 3400, 4000];
      osc.frequency.setValueAtTime(freqs[index], now + delay);
      osc.frequency.exponentialRampToValueAtTime(freqs[index] / 2, now + delay + 0.025);

      gain.gain.setValueAtTime(0.03, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.025);

      osc.start(now + delay);
      osc.stop(now + delay + 0.03);
    });
  } catch (e) {}
}

/**
 * 4. playLaunchSound: A sophisticated "charging-mechanical-switch" sequence.
 * Replaces the childish vintage bleep chord with a quick acceleration of micro-ticks,
 * followed immediately by a solid mechanical relay click and a deep damped soft impact.
 */
export function playLaunchSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sequence of 5 accelerated charging clicks
    const tickTimes = [0, 0.08, 0.15, 0.21, 0.26, 0.30];
    tickTimes.forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      // Pitch goes up as ticks speed up
      const freq = 1200 + i * 250;
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, now + delay + 0.015);

      gain.gain.setValueAtTime(0.04 + (i * 0.01), now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.015);

      osc.start(now + delay);
      osc.stop(now + delay + 0.02);
    });

    // The main heavy mechanical latch impact (at 0.35s)
    const latchDelay = 0.35;
    
    // Low frequency solid "thump"
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(90, now + latchDelay);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + latchDelay + 0.2);
    
    subGain.gain.setValueAtTime(0.18, now + latchDelay);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + latchDelay + 0.2);

    // High frequency metallic "ping" of the latch
    const metalOsc = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metalOsc.connect(metalGain);
    metalGain.connect(ctx.destination);
    metalOsc.type = 'triangle';
    metalOsc.frequency.setValueAtTime(3000, now + latchDelay);
    metalOsc.frequency.exponentialRampToValueAtTime(600, now + latchDelay + 0.04);

    metalGain.gain.setValueAtTime(0.08, now + latchDelay);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + latchDelay + 0.04);

    subOsc.start(now + latchDelay);
    subOsc.stop(now + latchDelay + 0.22);
    
    metalOsc.start(now + latchDelay);
    metalOsc.stop(now + latchDelay + 0.05);

  } catch (e) {}
}

/**
 * 5. playTabSound: A clean, crisp mechanical keyboard-like click.
 * Very short, tactile, and highly satisfying.
 */
export function playTabSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Triangle wave for woodblock/switch warmth
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.012);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch (e) {}
}
