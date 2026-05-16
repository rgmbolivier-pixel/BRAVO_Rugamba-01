from django.conf import settings
import json
from datetime import datetime, timedelta

class GeminiAIService:
    def __init__(self):
        try:
            import google.generativeai as genai
        except ModuleNotFoundError as exc:
            raise ModuleNotFoundError(
                "The 'google.generativeai' package is required for GeminiAIService. "
                "Install it with 'pip install google-generativeai' or disable Gemini AI features."
            ) from exc

        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set in settings")
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    def generate_waste_prediction(self, product_data, historical_data):
        """Predict waste risk for products using Gemini AI"""
        prompt = f"""
        Analyze this retail data and predict waste risk:
        
        Product: {product_data.get('name')}
        Current Stock: {product_data.get('current_stock')}
        Expiry Date: {product_data.get('expiry_date')}
        Daily Sales Average: {product_data.get('daily_sales_avg')}
        
        Historical Trends: {json.dumps(historical_data[:30])}
        
        Return a JSON with:
        1. risk_level (critical/high/medium/low)
        2. predicted_waste_units
        3. recommended_action (discount/transfer/donate/monitor)
        4. recommended_discount_percentage
        5. confidence_score (0-100)
        6. reasoning
        """
        
        response = self.model.generate_content(prompt)
        try:
            # Strip potential markdown formatting if Gemini returns it
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:-3]
            return json.loads(text)
        except Exception:
            return {
                "risk_level": "medium",
                "predicted_waste_units": 0,
                "recommended_action": "monitor",
                "recommended_discount_percentage": 0,
                "confidence_score": 50,
                "reasoning": "Error parsing AI response"
            }

    def generate_demand_forecast(self, product_id, days=30):
        """Generate demand forecast for next N days"""
        prompt = f"""
        Generate a {days}-day demand forecast for product {product_id}.
        Consider:
        - Day of week patterns
        - Holiday effects (Novruz, Ramadan, New Year)
        - Weather impacts
        - Historical sales trends
        
        Return JSON with:
        1. dates: list of dates
        2. predicted_demand: list of integers
        3. confidence_lower: list of integers
        4. confidence_upper: list of integers
        5. holiday_markers: list of dates with holidays
        """
        
        response = self.model.generate_content(prompt)
        return json.loads(response.text)

    def generate_anomaly_insight(self, discrepancy_data):
        """Analyze inventory discrepancy and provide insight"""
        prompt = f"""
        Analyze this inventory discrepancy:
        
        Product: {discrepancy_data.get('product_name')}
        POS Sales: {discrepancy_data.get('pos_quantity')}
        Physical Inventory: {discrepancy_data.get('inventory_quantity')}
        Discrepancy: {discrepancy_data.get('discrepancy')}
        
        Similar past patterns: {json.dumps(discrepancy_data.get('history', []))}
        
        Return JSON with:
        1. likely_cause (theft/scan_error/stock_misplacement/spoilage)
        2. confidence_level (0-100)
        3. recommended_action
        4. prevention_tips
        """
        
        response = self.model.generate_content(prompt)
        return json.loads(response.text)

    def generate_transfer_recommendation(self, surplus_stores, deficit_stores, product):
        """Recommend optimal transfers between stores"""
        prompt = f"""
        Recommend product transfers to prevent waste:
        
        Product: {product.get('name')}
        
        Stores with SURPLUS (expiring soon):
        {json.dumps(surplus_stores)}
        
        Stores with DEFICIT (need stock):
        {json.dumps(deficit_stores)}
        
        Return JSON with transfer recommendations:
        1. from_branch_id
        2. to_branch_id
        3. quantity
        4. urgency (high/medium/low)
        5. estimated_waste_prevented
        6. estimated_sales_recovered
        7. total_value_saved
        """
        
        response = self.model.generate_content(prompt)
        return json.loads(response.text)

    def get_chat_response(self, user_query, user_role, context_data):
        """Generate a role-restricted chat response based on system data"""
        prompt = f"""
        You are the BravoOS Intelligence Assistant, a sophisticated AI integrated into the Bravo Retail Operations System.
        Your goal is to provide deep insights, data analysis, and summaries based ONLY on the provided system context.

        ---
        USER ROLE: {user_role}
        SYSTEM CONTEXT (JSON): {json.dumps(context_data)}
        ---

        USER QUERY: {user_query}

        INSTRUCTIONS:
        1. ROLE-BASED INTELLIGENCE: 
           - If ADMIN: Provide high-level system summaries, network-wide performance metrics, and critical risk assessments.
           - If MANAGER: Focus on branch-specific optimization, inventory health, staff productivity, and local alerts.
           - If STAFF: Provide clear, actionable information about tasks, schedules, and specific inventory items they are responsible for.

        2. FORECASTING & DATA ANALYSIS:
           - Don't just list data; ANALYZE it. (e.g., "You have 5 expiring items" -> "You have 5 expiring items, mostly in the Dairy category, which represents a $200 potential loss if not moved today.")
           - If the user asks for a forecast, you MUST provide one based on the context data. Even if the data is zero or sparse, extrapolate a confident, plausible forecast using your generalized retail knowledge. 
           - NEVER complain about "insufficient historical data". NEVER tell the user to "record more data". NEVER reference the underlying dataset structure.

        3. TONE & STYLE:
           - Provide the answer in plain, human-readable language. Do NOT use JSON or programming terms.
           - Professional, data-driven, and proactive.
           - Use Markdown for structure: **bold**, *italics*, and - lists.
           - Speak directly to the user as their expert retail assistant.

        4. SAFETY:
           - Never reveal technical system details or passwords.
           - Stay strictly within the scope of BravoOS retail operations.

        RESPONSE:
        """
        
        response = self.model.generate_content(prompt)
        return response.text.strip()
