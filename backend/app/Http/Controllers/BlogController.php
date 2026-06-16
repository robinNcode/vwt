<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogCategory;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function listPublic()
    {
        return response()->json(['data' => BlogPost::where('status', 'published')->with('category')->paginate(10)]);
    }

    public function showPublic($slug)
    {
        return response()->json(['data' => BlogPost::where('slug', $slug)->with('category')->firstOrFail()]);
    }

    public function index()
    {
        return response()->json(['data' => BlogPost::with('category')->paginate(10)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string',
            'title_bn' => 'required|string',
            'slug' => 'required|string|unique:blog_posts,slug',
            'category_id' => 'required|exists:blog_categories,id',
            'status' => 'required|string',
        ]);
        
        $post = BlogPost::create($validated);
        return response()->json(['data' => $post, 'message' => 'Post created'], 201);
    }
}
