# 🚀 Quick Start Guide - Tablet Image Analyzer

Guide rapide pour démarrer le projet en 5 minutes.

## 📋 Prérequis

- ✅ Python 3.8+ installé
- ✅ Node.js 18+ installé
- ✅ Git installé

## 🎯 Démarrage en 3 étapes

### Étape 1: Cloner le projet (si pas déjà fait)

```bash
git clone https://github.com/DreMiller2323/IBM-HACKATHON.git
cd IBM-HACKATHON
```

### Étape 2: Démarrer le Backend (Terminal 1)

```bash
# Créer l'environnement virtuel Python
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur FastAPI
uvicorn app.main:app --reload --port 8000
```

✅ **Backend prêt!** → http://localhost:8000
📚 **Documentation API** → http://localhost:8000/docs

### Étape 3: Démarrer le Frontend (Terminal 2)

```bash
# Ouvrir un nouveau terminal
cd frontend

# Installer les dépendances Node.js
npm install

# Démarrer le serveur de développement
npm run dev
```

✅ **Frontend prêt!** → http://localhost:5173

---

## 🎉 C'est tout! Votre application est lancée!

Ouvrez votre navigateur à http://localhost:5173 et commencez à analyser des images de comprimés.

---

## 🔧 Configuration (Optionnel)

### Modifier l'URL du backend

Si vous changez le port du backend, mettez à jour `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

### Activer CORS (si erreurs de connexion)

Ajoutez dans `app/main.py` (après `app = FastAPI()`):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Tester l'API

### Via l'interface Swagger

1. Ouvrez http://localhost:8000/docs
2. Cliquez sur `/analyze`
3. Cliquez "Try it out"
4. Uploadez une image
5. Cliquez "Execute"

### Via cURL

```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@path/to/image.jpg"
```

### Via Python

```python
import requests

url = "http://localhost:8000/analyze"
files = {"file": open("tablet.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

---

## 🐛 Problèmes courants

### ❌ "Port 8000 already in use"

**Solution:** Utilisez un autre port
```bash
uvicorn app.main:app --reload --port 8001
```
Puis mettez à jour `frontend/.env.local` avec `VITE_API_URL=http://localhost:8001`

### ❌ "Module not found: tensorflow"

**Solution:** Réinstallez TensorFlow
```bash
pip install tensorflow --upgrade
```

### ❌ "npm ERR! code ENOENT"

**Solution:** Vérifiez que vous êtes dans le dossier `frontend/`
```bash
cd frontend
npm install
```

### ❌ "CORS error" dans le navigateur

**Solution:** Ajoutez le middleware CORS (voir section Configuration ci-dessus)

### ❌ Frontend ne se connecte pas au backend

**Vérifications:**
1. ✅ Backend tourne sur port 8000
2. ✅ `frontend/.env.local` existe avec `VITE_API_URL=http://localhost:8000`
3. ✅ CORS activé dans `app/main.py`
4. ✅ Redémarrez le frontend après modification de `.env.local`

---

## 📁 Structure du projet

```
IBM-HACKATHON/
├── app/                    # 🐍 Backend FastAPI
│   ├── main.py            # Endpoints API
│   ├── ml_models.py       # Modèles ML
│   └── ...
├── frontend/              # ⚛️ Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── services/      # Services API
│   │   └── ...
│   └── package.json
├── requirements.txt       # Dépendances Python
└── README.md             # Documentation complète
```

---

## 🎓 Prochaines étapes

1. **Explorez l'interface** → http://localhost:5173
2. **Testez l'upload d'images** → Drag & drop des images
3. **Consultez l'API** → http://localhost:8000/docs
4. **Lisez la doc complète** → `README.md`
5. **Développez de nouvelles features** → Voir `frontend/ARCHITECTURE.md`

---

## 📚 Documentation complète

- **README principal**: `README.md`
- **Frontend README**: `frontend/README.md`
- **Architecture**: `frontend/ARCHITECTURE.md`
- **Spécifications**: `frontend/COMPONENT_SPECS.md`
- **Guide d'implémentation**: `frontend/IMPLEMENTATION_GUIDE.md`

---

## 💡 Conseils

- **Développement simultané**: Gardez 2 terminaux ouverts (backend + frontend)
- **Hot reload**: Les deux serveurs se rechargent automatiquement lors des modifications
- **Logs**: Surveillez les terminaux pour les erreurs
- **API Docs**: Utilisez Swagger UI pour tester rapidement les endpoints

---

## 🆘 Besoin d'aide?

- 📖 Consultez `README.md` pour plus de détails
- 🐛 Ouvrez une issue sur GitHub
- 💬 Contactez l'équipe de développement

---

**Bon développement! 🚀**