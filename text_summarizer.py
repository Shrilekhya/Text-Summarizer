import sys
from transformers import BartForConditionalGeneration, BartTokenizer


# Loading pre-trained BART model and tokenizer
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")

if len(sys.argv) > 1:
    
    input_text = sys.argv[1]

    inputs = tokenizer(input_text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = model.generate(inputs["input_ids"], max_length=150, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    print(summary)
else:
    print("Please provide input text as a command-line argument.")







