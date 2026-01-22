import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize OpenAI Client
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

SYSTEM_PROMPT = """
Eres un asistente de atención al cliente amable y profesional para una tienda en línea llamada 'TechNova'.
Tu objetivo es ayudar a los usuarios con dudas sobre productos y pedidos.
Si el usuario pregunta por el estado de un pedido, simula consultar una base de datos.
Responde de manera concisa y servicial.
"""

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message')
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Simulation of "Customer Database Lookup"
        # If the user mentions "pedido", "orden" or "status", we log a "lookup"
        simulated_lookup = ""
        keywords = ["pedido", "orden", "estatus", "estado", "envio", "track"]
        if any(keyword in user_message.lower() for keyword in keywords):
            print(f"[DATABASE] Consultando estado para el mensaje: '{user_message}'...")
            simulated_lookup = "\n\n*(Sistema: Consultando base de datos de pedidos...)*"

        # Call OpenAI API
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ]
        )

        bot_reply = completion.choices[0].message.content
        
        # Determine strict or loose simulation integration:
        # We can append the simulation log to the user response or just leave it in the console.
        # The prompt asked for a print, but showing it in UI is nice too.
        # Let's keep it in the reply for better UX transparency as "System Log".
        
        return jsonify({"reply": bot_reply, "simulation": simulated_lookup})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
