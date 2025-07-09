import librosa
import numpy as np
import sys
import matplotlib.pyplot as plt

def get_audio_spike(filename, threshold=0.5):
    # 1. Load the audio file
    y, sr = librosa.load(filename)  # or .wav, etc.

    # 2. Calculate short-term energy
    frame_length = 2048
    hop_length = 512
    energy = np.array([
        sum(abs(y[i:i+frame_length]**2))
        for i in range(0, len(y), hop_length)
    ])

    # 3. Normalize energy
    energy = (energy - np.min(energy)) / (np.max(energy) - np.min(energy))

    # 4. Detect spikes
    # threshold = 0.6  # tune this!
    spike_indices = np.where(energy > threshold)[0]
    spike_times = spike_indices * hop_length / sr  # in seconds

    # 5. Output times
    # print("Audio spikes at seconds:", spike_times)
    impluse_spikes = []
    for i in range(len(spike_times)):
        if i == 0 or spike_times[i] - spike_times[i-1] > 60:
            impluse_spikes.append(float(spike_times[i]))
    
    filename = filename.split('/')[-1].split('.')[0]
    plt.figure(figsize=(14, 4))
    plt.plot(energy, label='Normalized Energy')
    plt.axhline(threshold, color='r', linestyle='--', label='Threshold')
    plt.legend()
    plt.title(filename)
    plt.savefig(f'dumps/audio-spike-graph/{filename}.png')

    return impluse_spikes


if __name__ == "__main__":
    filename = sys.argv[1]
    threshold = sys.argv[2] if len(sys.argv) > 2 else 0.5
    result = get_audio_spike(filename, float(threshold))
    print(result)