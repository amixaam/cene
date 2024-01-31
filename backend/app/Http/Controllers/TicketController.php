<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Barryvdh\DomPDF\Facade\Pdf;

class TicketController extends Controller
{
    public function getHistory()
    {
        $orders = Order::with('event')
            ->where('user_id', auth()->user()->id)
            ->where('status', '!=', 'unpaid')
            ->get();

        $dataPackage = [];
        foreach ($orders as $order) {
            $tickets = $order->ticket_ids;
            $tickets = explode(',', $tickets);

            $ticketsData = [];
            foreach ($tickets as $ticket) {
                $ticket = Ticket::find($ticket);
                $ticketsData[] = [
                    'id' => $ticket->id,
                    'row' => $ticket->row_num,
                    'col' => $ticket->col_num,
                ];
            }

            $dataPackage[] = [
                'created_at' => $order->created_at,
                'status' => $order->status,
                'amount' => $order->amount / 100,
                'event' => $order->event,
                'tickets' => $ticketsData,
            ];
        }

        return response()->json($dataPackage);
    }

    public function createPDF(Request $request)
    {
        $pdf = PDF::loadView('report', [
            'event' => $request->get('event'),
            'tickets' => $request->get('tickets'),
        ]);

        return response($pdf->output())
            ->header(
                'Content-Type',
                'application/pdf'
            )
            ->header('Content-Disposition', 'attachment; filename="ticket.pdf"');
    }
}
