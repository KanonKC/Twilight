import json

initial = '''{
    "youtube": [
        {
            "url": "",
            "highlight": [
                {"start": "0","end": "0"}
            ]
        }
    ]
}
'''

open('tickets/download/ticket.json','w').write(initial)
print("Reset Download Ticket successfully!")