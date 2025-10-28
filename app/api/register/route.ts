import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    // Get data from request body
    const { name, email, password } = await request.json();

    // Validation: Check if all fields are provided
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all fields' },
        { status: 400 }
      );
    }

    // Validation: Check password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validation: Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    // Note: image and bio will use default values from schema
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      // image: '/default-avatar.jpg' (automatic from schema)
      // bio: '' (automatic from schema)
    });

    // Return success response (without password!)
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}