import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadAvatarSettings, updateAvatarSettings } from '../helpers/fileSystemCRUD';
//Context deals with savind and updating the avatar settings, then the context is what is used acreoss the app
type AvatarContextType = {
  name: string;
  color: number | null;
  eyeType: number | null;
  setName: (name: string) => void;
  setColor: (color: number) => void;
  setEyeType: (eyeType: number) => void;
};

// Create Context
const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

// Create a custom hook to use the AvatarContext
export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within AvatarProvider');
  }
  return context;
};

// AvatarProvider component to wrap the app
export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<number | null>(null);
  const [eyeType, setEyeType] = useState<number | null>(null);

  // Load the settings on first render
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await loadAvatarSettings();
      if (settings) {
        setName(settings.name);
        setColor(settings.color);
        setEyeType(settings.eyeType);
      }
    };
    loadSettings();
  }, []);

  // Save settings whenever they change
  const updateAvatar = async (newSettings: Partial<{ name: string; color: number; eyeType: number }>) => {
    if (newSettings.name !== undefined) setName(newSettings.name);
    if (newSettings.color !== undefined) setColor(newSettings.color);
    if (newSettings.eyeType !== undefined) setEyeType(newSettings.eyeType);

    await updateAvatarSettings(newSettings);
  };

  return (
    <AvatarContext.Provider
      value={{
        name,
        color,
        eyeType,
        setName: (name) => updateAvatar({ name }),
        setColor: (color) => updateAvatar({ color }),
        setEyeType: (eyeType) => updateAvatar({ eyeType }),
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};
