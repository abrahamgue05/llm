# Automated Customer Service Chatbot

## Setup

1.  **Create a Virtual Environment**:
    ```bash
    python -m venv venv
    ```

2.  **Activate the Virtual Environment**:
    *   Windows: `.\venv\Scripts\activate`
    *   Mac/Linux: `source venv/bin/activate`

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Environment Variables**:
    *   Create a `.env` file in the root directory.
    *   Add your OpenAI API Key: `OPENAI_API_KEY=your_key_here`

## Running the Application

1.  Start the Flask server:
    ```bash
    python app.py
    ```
2.  Open your browser and navigate to: `http://127.0.0.1:5000`
