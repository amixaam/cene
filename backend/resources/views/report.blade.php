<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Report</title>
    <style>
        * {
            margin: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #ffeade;
        }

        table {
            width: 96%;
            border-collapse: collapse;
            margin: 1rem;
        }
        
        tr {
            border-radius: 15px;
            border: none;
            text-align: left;
            background-color: #ffbd99;
            
        }
        td {
            padding: 2rem;
        }
        td:last-child {
            width: 100px;
        }
        .gap {
            height: 1rem;
            width: 100%;
        }
        h2 {
            font-size: 3rem;
        }
        p {
            font-size: 1.25rem;
        }
        .please-god-help-me {
            margin-top: 1rem;
            width: 100%;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1 class="please-god-help-me">Your order for {{ $event['name'] }}</h1>
    <table>
        <thead>
            <tr>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tickets as $ticket)
                <tr>
                    <td>
                        <h2>{{ $event['name'] }}</h2>
                        <p>{{ $event['time']}}, {{ $event['length']}} minutes</p>
                        <p>Row {{ $ticket['row'] }}, Seat {{ $ticket['col'] }}</p>
                    </td>
                    <td>
                        <?php
                            // Generate the QR code with custom styles
                            $qrCode = QrCode::size(100)
                                ->backgroundColor(255, 122, 51, 0)
                                ->color(102, 37, 0)
                                ->generate('http://127.0.0.1:8000/api/payments/redeem/' . $ticket['id']);
                        ?>
                        <img class="qr-code" src="data:image/png;base64,{{ base64_encode($qrCode) }}" alt="QR Code" style="width: 100px; height: 100px;">
                    </td>
                </tr>
                <div class="gap"></div>
            @endforeach
        </tbody>
    </table>
</body>
</html>
