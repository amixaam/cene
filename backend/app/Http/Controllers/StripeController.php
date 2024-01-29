<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\VipSeat;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class StripeController extends Controller
{
    protected function createTickets($seats, $event_id)
    {
        $tickets = [];
        $lineItems = [];
        $totalPrice = 0;

        // seat range [0,0] - [5,12]
        foreach ($seats as $key => $value) {
            $ticket = Ticket::where('event_id', $event_id)
                ->where('row_num', $value[0])
                ->where('col_num', $value[1])
                ->first();

            if ($ticket) {
                return ['errors' => 'Seat taken'];
            }

            $event = Event::where('id', $event_id)
                ->first();

            $vipSeat = VipSeat::where('event_id', $event_id)
                ->where('row_num', $value[0])
                ->where('col_num', $value[1])
                ->first();

            $isVIP = false;
            if ($vipSeat) $isVIP = true;

            $price = $isVIP ? $event->vip_ticket_price : $event->regular_ticket_price;
            $totalPrice += $price;

            $tickets[] = [
                'event_id' => $event_id,
                'row_num' => $value[0],
                'col_num' => $value[1],
                'type' => $isVIP ? "vip" : "regular",
                'price' => $price,
                'redeemed' => false,
            ];
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $event->name . " ticket for seat " . $value[1] . " on row " . $value[0],
                    ],
                    'unit_amount' => $price * 100
                ],
                'quantity' => 1,
            ];
        }

        return ['tickets' => $tickets, 'line_items' => $lineItems, 'total_price' => ($totalPrice * 100)];
    }
    public function checkout(Request $request)
    {
        // return response()->json($request->all());
        try {
            $request->validate([
                'event_id' => 'required|integer',
                'seats' => 'required|array', //[[1,2][2,6]] [row, col]
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        //Returns ticket data
        $ticketData = $this->createTickets($request->get('seats'), $request->get('event_id'));
        if (array_key_exists('errors', $ticketData)) {
            return response()->json(['errors' => $ticketData['errors']], 422);
        }

        $frontendURL = "http://localhost:3000/";

        // return response()->json($ticketData['line_items']);
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));


        $session = \Stripe\Checkout\Session::create([
            'line_items' => $ticketData['line_items'],
            'mode' => 'payment',
            'success_url' => $frontendURL . "success" . "?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url' => $frontendURL . "cancel",
        ]);

        $ticketIds = [];
        foreach ($ticketData['tickets'] as $ticket) {
            $ticketModel = Ticket::create($ticket);
            $ticketIds[] = $ticketModel->id;
        }
        $ticketIdsString = implode(', ', $ticketIds);

        $order = Order::create([
            'user_id' => auth()->user()->id,
            'event_id' => $request->get('event_id'),
            'ticket_ids' => $ticketIdsString,
            'session_id' => $session->id,
            'amount' => $ticketData['total_price'],
            'status' => 'unpaid',
        ]);

        //send frontend link to stripe payment site
        return response()->json($session->url);
    }

    public function success(Request $request)
    {
        try {
            $request->validate([
                'session_id' => 'required|string',
            ]);

            $order = Order::where('session_id', $request->session_id)->first();

            if (!$order) {
                return response()->json(["error" => 'Order not found']);
            }

            if ($order->status === 'paid') {
                return response()->json(["error" => 'Order already paid']);
            }

            // Update specific fields based on your requirements
            $order->update([
                'status' => 'paid',
            ]);

            return response()->json(["success" => "success!"]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(["error" => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }




    public function cancel()
    {
    }

    public function webhook()
    {
        // This is your Stripe CLI webhook secret for testing your endpoint locally.
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            // Invalid payload
            return response('', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            return response('', 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;

                $order = Order::where('session_id', $session->id)->first();
                if ($order && $order->status === 'unpaid') {
                    $order->status = 'paid';
                    $order->save();
                    // Send email to customer
                }

                // ... handle other event types
            default:
                echo 'Received unknown event type ' . $event->type;
        }

        return response('');
    }
}
