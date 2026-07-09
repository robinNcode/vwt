<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'subject' => 'nullable|string',
            'message' => 'required|string',
        ]);

        $message = ContactMessage::create([
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'] ?? null,
            'message' => trim($data['message']),
            'is_read' => false,
        ]);

        return ApiResponse::created('Message submitted successfully', $message);
    }

    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $query = ContactMessage::query()->orderByDesc('id');
        if ($search !== '') {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('subject', 'like', $like);
            });
        }

        return ApiResponse::ok('Messages fetched successfully', $query->get());
    }

    public function markRead($id)
    {
        $message = ContactMessage::find($id);
        if (! $message) {
            return ApiResponse::fail('Failed to update message', 500);
        }
        $message->is_read = true;
        $message->save();

        return ApiResponse::ok('Message updated successfully', ['id' => (int) $id, 'is_read' => true]);
    }

    public function unreadCount()
    {
        $count = ContactMessage::where('is_read', false)->count();

        return ApiResponse::ok('Unread count fetched', ['count' => $count]);
    }
}
