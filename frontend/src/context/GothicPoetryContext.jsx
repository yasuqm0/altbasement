import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const GothicPoetryContext = createContext();

export const GothicPoetryProvider = ({ children }) => {
  const [poem, setPoem] = useState(null);
  const [theme, setTheme] = useState('theme-niebla'); // theme-cripta, theme-vampirico, theme-niebla
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [poemsList, setPoemsList] = useState([]);

  const fetchPoems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://poetrydb.org/author/Edgar%20Allan%20Poe');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setPoemsList(response.data);
        selectRandomPoem(response.data);
      } else {
        throw new Error('No se encontraron poemas.');
      }
    } catch (err) {
      console.error('Error al obtener poesía:', err);
      setError('Las sombras impidieron invocar la poesía de Edgar Allan Poe.');
      // Fragmento de respaldo de El Cuervo
      const fallbackPoem = {
        title: "The Raven (Fragmento)",
        author: "Edgar Allan Poe",
        lines: [
          "Once upon a midnight dreary, while I pondered, weak and weary,",
          "Over many a quaint and curious volume of forgotten lore—",
          "While I nodded, nearly napping, suddenly there came a tapping,",
          "As of some one gently rapping, rapping at my chamber door.",
          "“'Tis some visitor,” I muttered, “tapping at my chamber door—",
          "            Only this and nothing more.”"
        ]
      };
      setPoem(fallbackPoem);
      applyTheme(fallbackPoem);
    } finally {
      setLoading(false);
    }
  };

  const selectRandomPoem = (list = poemsList) => {
    if (list.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    const selectedPoem = list[randomIndex];
    setPoem(selectedPoem);
    applyTheme(selectedPoem);
  };

  const applyTheme = (selectedPoem) => {
    if (!selectedPoem) return;
    const fullText = (selectedPoem.title + ' ' + (selectedPoem.lines || []).join(' ')).toLowerCase();
    
    // Palabras clave para alternar entre temas góticos
    const criptaKeywords = ['death', 'shadow', 'grave', 'dark', 'doom', 'dead', 'sepulchre', 'tomb', 'ghost', 'ghoul', 'shroud', 'crypt', 'mourn', 'dread'];
    const vampiricoKeywords = ['blood', 'love', 'heart', 'red', 'kiss', 'beauty', 'blush', 'beloved', 'bride', 'lips', 'passion', 'vein', 'crimson'];
    
    const hasCripta = criptaKeywords.some(keyword => fullText.includes(keyword));
    const hasVampirico = vampiricoKeywords.some(keyword => fullText.includes(keyword));
    
    if (hasCripta && !hasVampirico) {
      setTheme('theme-cripta');
    } else if (hasVampirico && !hasCripta) {
      setTheme('theme-vampirico');
    } else if (hasCripta && hasVampirico) {
      // Priorizar aleatoriamente o balancear por palabras encontradas
      setTheme(Math.random() > 0.5 ? 'theme-cripta' : 'theme-vampirico');
    } else {
      setTheme('theme-niebla');
    }
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  return (
    <GothicPoetryContext.Provider value={{ poem, theme, loading, error, invokeNewPoem: () => selectRandomPoem(), fetchPoems }}>
      {children}
    </GothicPoetryContext.Provider>
  );
};

export const useGothicPoetry = () => useContext(GothicPoetryContext);
export default GothicPoetryContext;
