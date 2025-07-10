import librosa
import numpy as np
import matplotlib.pyplot as plt

# 1. Load the audio file
y, sr = librosa.load("dumps/youtube_7y9oqqGhkGk_Ykps.mp4")  # or .wav, etc.

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
threshold = 0.5  # tune this!
spike_indices = np.where(energy > threshold)[0]
spike_times = spike_indices * hop_length / sr  # in seconds

# 5. Output times
print("Audio spikes at seconds:", spike_times)

# Optional: Visualize
plt.figure(figsize=(14, 4))
plt.plot(energy, label='Normalized Energy')
plt.axhline(threshold, color='r', linestyle='--', label='Threshold')
plt.legend()
plt.title("Energy over time")
plt.show()
