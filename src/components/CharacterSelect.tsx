import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Skull, Target, Crown, Zap, Briefcase, BookOpen, Star, Brain } from "lucide-react";

interface Character {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
}

const characters: Character[] = [
  {
    id: "walter-white",
    name: "Walter White",
    subtitle: "The Chemistry Teacher",
    description: "Precise, calculating, and methodical. I am the one who knocks.",
    icon: <Skull className="h-8 w-8" />,
    bgColor: "from-poison-green/10 to-background"
  },
  {
    id: "dexter",
    name: "Dexter Morgan",
    subtitle: "The Dark Passenger",
    description: "Analytical, methodical, and eerily calm. Tonight's the night.",
    icon: <Target className="h-8 w-8" />,
    bgColor: "from-blood-red/10 to-background"
  },
  {
    id: "thomas-shelby",
    name: "Thomas Shelby",
    subtitle: "The Peaky Blinder",
    description: "Strategic, ambitious, and ruthless. By order of the Peaky Blinders.",
    icon: <Crown className="h-8 w-8" />,
    bgColor: "from-industrial-orange/10 to-background"
  },
  {
    id: "jesse-pinkman",
    name: "Jesse Pinkman",
    subtitle: "The Street Smart Sidekick",
    description: "Yo, science, bitch! Street smart, impulsive, and loyal.",
    icon: <Zap className="h-8 w-8" />,
    bgColor: "from-yellow-500/10 to-background"
  },
  {
    id: "harvey-specter",
    name: "Harvey Specter",
    subtitle: "The Closer",
    description: "Slick, confident, and always three steps ahead.",
    icon: <Briefcase className="h-8 w-8" />,
    bgColor: "from-slate-700/10 to-background"
  },
  {
    id: "mike-ross",
    name: "Mike Ross",
    subtitle: "The Prodigy",
    description: "Photographic memory. Intuitive. Always fighting for what's right.",
    icon: <Brain className="h-8 w-8" />,
    bgColor: "from-blue-400/10 to-background"
  },
  {
    id: "louis-litt",
    name: "Louis Litt",
    subtitle: "The Eccentric Genius",
    description: "Brilliant, neurotic, and totally Litt up!",
    icon: <Star className="h-8 w-8" />,
    bgColor: "from-purple-600/10 to-background"
  },
];

interface CharacterSelectProps {
  onSelectCharacter: (characterId: string) => void;
}

export default function CharacterSelect({ onSelectCharacter }: CharacterSelectProps) {
  return (
    <div className="min-h-screen bg-gradient-crime flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-poison-green to-poison-green-glow bg-clip-text text-transparent">
            Persona Chat
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Step into the minds of television's most complex characters. Choose your persona and begin the conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          {characters.map((character, index) => (
            <Card 
              key={character.id}
              className={`group relative overflow-hidden border-border/20 bg-gradient-to-br ${character.bgColor} 
                          hover:border-primary/50 transition-all duration-500 hover:shadow-glow cursor-pointer
                          animate-fade-in`}
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => onSelectCharacter(character.id)}
            >
              <CardContent className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-primary group-hover:text-poison-green-glow transition-colors duration-300">
                    {character.icon}
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {character.name}
                </h3>
                
                <p className="text-sm text-primary/70 font-medium mb-4 uppercase tracking-wider">
                  {character.subtitle}
                </p>
                
                <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
                  {character.description}
                </p>

                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground 
                           group-hover:border-primary transition-all duration-300"
                >
                  Enter Mind
                </Button>
              </CardContent>

              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-glow transition-opacity duration-500 pointer-events-none" />
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <p className="text-sm text-muted-foreground">
            Powered by advanced AI • Responses are simulated character interpretations
          </p>
        </div>
      </div>
    </div>
  );
}