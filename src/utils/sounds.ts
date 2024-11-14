const sounds = {
  startup: new Audio('/windows-xp/sounds/startup.wav'),
  error: new Audio('/windows-xp/sounds/error.wav'),
  notify: new Audio('/windows-xp/sounds/notify.wav'),
  shutdown: new Audio('/windows-xp/sounds/shutdown.wav'),
  click: new Audio('/windows-xp/sounds/click.wav')
};

export const playSound = (soundName: keyof typeof sounds) => {
  sounds[soundName].currentTime = 0;
  sounds[soundName].play().catch(() => {});
};
