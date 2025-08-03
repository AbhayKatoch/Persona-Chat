import { useState } from 'react';
import CharacterSelect from '@/components/CharacterSelect';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const handleBackToSelection = () => {
    setSelectedCharacter(null);
  };

  if (selectedCharacter) {
    return (
      <ChatInterface 
        characterId={selectedCharacter} 
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <CharacterSelect onSelectCharacter={handleSelectCharacter} />
  );
};

export default Index;
