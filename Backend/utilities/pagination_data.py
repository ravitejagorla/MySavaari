def get_pagination_data(paginator, page_obj):
    """
    Safely extracts pagination data from Django Paginator and Page objects.
    Ensures safe retrieval of next/previous page numbers.
    """
    
    # Handle case where there are no departments
    if paginator.count == 0:
        return {
            'total': 0,
            'pages': 1,
            'current_page': 1,
            'start_index': 0,
            'has_next': False,
            'next_page_number': 1,
            'has_previous': False,
            'previous_page_number': 1,
        }

    return {
        'total': paginator.count,
        'pages': paginator.num_pages,
        'current_page': page_obj.number,
        
        # Safely determine start_index (returns 0 if page is empty)
        'start_index': page_obj.start_index() if page_obj.object_list else 0,
        
        'has_next': page_obj.has_next(),
        # Use a safe default if no next page exists
        'next_page_number': page_obj.next_page_number() if page_obj.has_next() else page_obj.number,
        
        'has_previous': page_obj.has_previous(),
        # Use a safe default if no previous page exists
        'previous_page_number': page_obj.previous_page_number() if page_obj.has_previous() else page_obj.number,
    }