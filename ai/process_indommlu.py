import csv
import json
import os
import random

def format_options(options_str):
    return options_str.replace('\n', ' ')

def process_indommlu(input_file, output_file):
    print(f"🔄 Processing {input_file}...")
    
    sft_data = []
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                question = row.get('soal', '').strip()
                options = row.get('jawaban', '').strip()
                answer_key = row.get('kunci', '').strip()
                subject = row.get('subject', 'General')
                level = row.get('level', 'General')
                
                if not question or not options or not answer_key:
                    continue
                
                # Instruction for the model
                instruction = f"Jawablah pertanyaan berikut mengenai {subject} ({level})."
                
                # Create the full input with options
                full_input = f"{question}\n\nPilihan Jawaban:\n{options}"
                
                # Determine the full answer text based on the key
                # This is a heuristic; simpler is just to provide the key.
                # For better SFT, we might want "Jawaban yang benar adalah {KEY}."
                output_text = f"Jawaban yang benar adalah {answer_key}."
                
                # Create SFT entry (Alpaca/Instruction format)
                entry = {
                    "instruction": instruction,
                    "input": full_input,
                    "output": output_text,
                    "source": "IndoMMLU",
                    "subject": subject
                }
                
                sft_data.append(entry)
                
        # Save to JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(sft_data, f, indent=2, ensure_ascii=False)
            
        print(f"✅ Successfully converted {len(sft_data)} items.")
        print(f"💾 Saved to {output_file}")
        
        # Also create a sample preview
        print("\n🔍 Sample Data:")
        print(json.dumps(sft_data[0], indent=2))
        
    except Exception as e:
        print(f"❌ Error processing file: {e}")

if __name__ == "__main__":
    INPUT_CSV = "data/IndoMMLU/data/indoMMLU.csv"
    OUTPUT_JSON = "data/indo_sft_train.json"
    
    if os.path.exists(INPUT_CSV):
        process_indommlu(INPUT_CSV, OUTPUT_JSON)
    else:
        print(f"❌ Input file not found: {INPUT_CSV}")
