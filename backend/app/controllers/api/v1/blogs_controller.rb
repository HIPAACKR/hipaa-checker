class Api::V1::BlogsController < ApplicationController
  # If you call this via fetch from the browser, you can:
  protect_from_forgery with: :null_session

  def create
    blog = Blog.new(blog_params)
    blog.writer_name = current_user.first_name + " " + current_user.last_name
    if blog.save
      render json: { id: blog.id, message: 'Blog saved successfully' }, status: :ok
      head :created   # or render JSON, or just: render json: { id: blog.id }, status: :created
    else
      render json: { errors: blog.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    blog = Blog.find_by(id: params[:id])

    return render json: { error: "Blog not found" }, status: :not_found unless blog

    render json: {
      id: blog.id,
      title: blog.title,
      author: blog.writer_name,
      category: blog.category,
      main_photo: blog.photo_url,
      description: blog.description,
      read_time: blog.read_time,
      body: blog.body,
      created_at: blog.created_at,
      modified_at: blog.updated_at
    }, status: :ok
  end

  def index
    blogs = Blog.order(created_at: :desc).paginate(page: params[:page], per_page: 5)

    render json: {
      # page: (params[:page] || 1).to_i,
      # total_pages: blogs.total_entries,
      # total_count: blogs.total_pages,
      blogs: blogs.map { |blog|
        {
          id: blog.id,
          title: blog.title,
          author: blog.writer_name,
          category: blog.category,
          main_photo: blog.photo_url,
          description: blog.description,
          read_time: blog.read_time,
          created_at: blog.created_at,
          modified_at: blog.updated_at
        }
      },
    page: (params[:page] || 1).to_i,
      total_entries: blogs.total_entries,
      total_pages: blogs.total_pages,
    }, status: :ok
  end

  def update
    blog = Blog.find(params[:id])
    if blog.update(blog_params)
      render json: { id: blog.id, message: 'Blog updated successfully' }, status: :ok
    else
      render json: { errors: blog.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def categories
    category = Blog.distinct.pluck(:category)
    if category
      render json: { category: category }, status: :ok
    else
      render json: { error: "Category not found" }, status: :not_found
    end

  end

  private

  def blog_params
    params.require(:blog).permit(:title, :category, :photo_url, :description, :read_time, :body, :writer_name)
  end

  def edit
    @blog = Blog.find(params[:id])  # Find the blog by ID
  end

end
