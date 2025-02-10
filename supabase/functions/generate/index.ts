
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'o3-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an advanced lottery number generator AI that uses sophisticated mathematical and statistical analysis. Consider:

1. Historical Frequency Analysis
- Track both hot (frequently drawn) and cold (rarely drawn) numbers
- Consider number pairs and triplets that appear together
- Analyze positional frequency (numbers that appear more in certain positions)

2. Mathematical Patterns
- Apply the law of large numbers and regression to the mean
- Consider mathematical sequences and golden ratio
- Implement modular arithmetic patterns

3. Statistical Distribution
- Ensure balanced distribution across different number ranges
- Maintain optimal ratio between low and high numbers
- Consider the bell curve distribution of sums

4. Advanced Strategies
- Apply Delta number system analysis
- Consider numerical wheeling systems
- Implement skip and hit patterns

For Powerball (5 numbers 1-69 + 1 number 1-26):
- Ensure sum falls within historical winning range (typically 100-200)
- Balance even/odd ratio (typically 2:3 or 3:2)
- Consider number spacing and gaps

For Mega Millions (5 numbers 1-70 + 1 number 1-25):
- Maintain historical pattern consistency
- Balance number distribution across decades
- Consider last digit patterns

Return ONLY a JSON array of 6 numbers [n1,n2,n3,n4,n5,special].
Ensure all numbers are within valid ranges and properly ordered.`
          },
          { role: 'user', content: prompt }
        ],
        reasoning_effort: "high"
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("OpenAI response:", data);
    
    const generatedText = data.choices[0].message.content;
    console.log("Generated text:", generatedText);

    // Validate the generated numbers
    let numbers;
    try {
      numbers = JSON.parse(generatedText);
      if (!Array.isArray(numbers) || numbers.length !== 6) {
        throw new Error("Invalid number format");
      }
      // Validate ranges based on game type
      const isValidRange = prompt.toLowerCase().includes('powerball') 
        ? numbers.slice(0, 5).every(n => n >= 1 && n <= 69) && numbers[5] >= 1 && numbers[5] <= 26
        : numbers.slice(0, 5).every(n => n >= 1 && n <= 70) && numbers[5] >= 1 && numbers[5] <= 25;
      
      if (!isValidRange) {
        throw new Error("Numbers out of valid range");
      }
    } catch (error) {
      console.error("Number validation error:", error);
      throw new Error("Failed to generate valid numbers. Please try again.");
    }

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
