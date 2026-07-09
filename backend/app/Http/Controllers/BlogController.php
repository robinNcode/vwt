<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Return published blog posts with their category for the public site.
     */
    public function listPublic()
    {
        $posts = BlogPost::where('status', 'published')->with('category')->orderByDesc('id')->get();

        return ApiResponse::ok('Posts fetched successfully', $posts);
    }

    /**
     * Return a single published-or-draft post by slug for the public site.
     */
    public function showPublic($slug)
    {
        $post = BlogPost::where('slug', $slug)->with('category')->first();
        if (! $post) {
            return ApiResponse::fail('Post not found', 404);
        }

        return ApiResponse::ok('Post fetched successfully', $post);
    }

    /**
     * List all blog posts for admin management, newest first.
     */
    public function index()
    {
        return ApiResponse::ok('Posts fetched successfully', BlogPost::with('category')->orderByDesc('id')->get());
    }

    /**
     * Create a blog post.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title_en' => 'required|string',
            'title_bn' => 'required|string',
            'slug' => 'required|string|unique:blog_posts,slug',
            'category_id' => 'nullable|exists:blog_categories,id',
            'status' => 'required|string',
        ]);

        return ApiResponse::created('Post created successfully', BlogPost::create($data));
    }
}
