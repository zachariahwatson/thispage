export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      club_invite_codes: {
        Row: {
          club_id: number
          code: string
          created_at: string
          creator_member_id: number | null
          expiration_date: string | null
          id: number
          uses: number
        }
        Insert: {
          club_id: number
          code?: string
          created_at?: string
          creator_member_id?: number | null
          expiration_date?: string | null
          id?: number
          uses: number
        }
        Update: {
          club_id?: number
          code?: string
          created_at?: string
          creator_member_id?: number | null
          expiration_date?: string | null
          id?: number
          uses?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_invite_codes_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club_invite_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_invite_codes_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_invite_codes_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "spreads_count_view"
            referencedColumns: ["club_id"]
          },
          {
            foreignKeyName: "club_invite_codes_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_invite_codes_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
        ]
      }
      club_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["club_permission"]
          role: Database["public"]["Enums"]["club_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["club_permission"]
          role: Database["public"]["Enums"]["club_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["club_permission"]
          role?: Database["public"]["Enums"]["club_role"]
        }
        Relationships: []
      }
      clubs: {
        Row: {
          created_at: string
          creator_user_id: string | null
          description: string | null
          editor_member_id: number | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          creator_user_id?: string | null
          description?: string | null
          editor_member_id?: number | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          creator_user_id?: string | null
          description?: string | null
          editor_member_id?: number | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_creator_user_id_fkey"
            columns: ["creator_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
        ]
      }
      comments: {
        Row: {
          author_member_id: number | null
          content: string
          created_at: string
          id: number
          likes_count: number
          post_id: number
          replying_to_comment_id: number | null
          root_comment_id: number | null
          updated_at: string | null
        }
        Insert: {
          author_member_id?: number | null
          content: string
          created_at?: string
          id?: number
          likes_count?: number
          post_id: number
          replying_to_comment_id?: number | null
          root_comment_id?: number | null
          updated_at?: string | null
        }
        Update: {
          author_member_id?: number | null
          content?: string
          created_at?: string
          id?: number
          likes_count?: number
          post_id?: number
          replying_to_comment_id?: number | null
          root_comment_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_member_id_fkey"
            columns: ["author_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_author_member_id_fkey"
            columns: ["author_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post_metadata_view"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_replying_to_comment_id_fkey"
            columns: ["replying_to_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_root_comment_id_fkey"
            columns: ["root_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      intervals: {
        Row: {
          created_at: string
          goal_page: number | null
          goal_section: number | null
          id: number
          is_complete: boolean | null
          reading_id: number
        }
        Insert: {
          created_at?: string
          goal_page?: number | null
          goal_section?: number | null
          id?: number
          is_complete?: boolean | null
          reading_id: number
        }
        Update: {
          created_at?: string
          goal_page?: number | null
          goal_section?: number | null
          id?: number
          is_complete?: boolean | null
          reading_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "intervals_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: false
            referencedRelation: "readings"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          comment_id: number | null
          created_at: string
          id: number
          member_id: number | null
          post_id: number | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          id?: number
          member_id?: number | null
          post_id?: number | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          id?: number
          member_id?: number | null
          post_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post_metadata_view"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      member_interval_progresses: {
        Row: {
          id: number
          interval_id: number
          is_complete: boolean
          member_id: number
          updated_at: string | null
        }
        Insert: {
          id?: number
          interval_id: number
          is_complete?: boolean
          member_id: number
          updated_at?: string | null
        }
        Update: {
          id?: number
          interval_id?: number
          is_complete?: boolean
          member_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_interval_progresses_interval_id_fkey"
            columns: ["interval_id"]
            isOneToOne: false
            referencedRelation: "intervals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_interval_progresses_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_interval_progresses_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
        ]
      }
      member_roles: {
        Row: {
          editor_member_id: number | null
          id: number
          member_id: number
          role: Database["public"]["Enums"]["club_role"]
          updated_at: string | null
        }
        Insert: {
          editor_member_id?: number | null
          id?: number
          member_id: number
          role?: Database["public"]["Enums"]["club_role"]
          updated_at?: string | null
        }
        Update: {
          editor_member_id?: number | null
          id?: number
          member_id?: number
          role?: Database["public"]["Enums"]["club_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_roles_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_roles_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "member_roles_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_roles_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: true
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
        ]
      }
      members: {
        Row: {
          club_id: number
          created_at: string
          id: number
          is_favorite: boolean
          used_club_invite_code: string | null
          user_id: string
        }
        Insert: {
          club_id: number
          created_at?: string
          id?: number
          is_favorite?: boolean
          used_club_invite_code?: string | null
          user_id: string
        }
        Update: {
          club_id?: number
          created_at?: string
          id?: number
          is_favorite?: boolean
          used_club_invite_code?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club_invite_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "spreads_count_view"
            referencedColumns: ["club_id"]
          },
          {
            foreignKeyName: "members_used_club_invite_code_fkey"
            columns: ["used_club_invite_code"]
            isOneToOne: false
            referencedRelation: "club_invite_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_items: {
        Row: {
          book_authors: string[] | null
          book_cover_image_height: number | null
          book_cover_image_url: string | null
          book_cover_image_width: number | null
          book_description: string | null
          book_open_library_id: string
          book_page_count: number
          book_title: string
          created_at: string
          creator_member_id: number | null
          id: number
          poll_id: number
        }
        Insert: {
          book_authors?: string[] | null
          book_cover_image_height?: number | null
          book_cover_image_url?: string | null
          book_cover_image_width?: number | null
          book_description?: string | null
          book_open_library_id: string
          book_page_count: number
          book_title: string
          created_at?: string
          creator_member_id?: number | null
          id?: number
          poll_id: number
        }
        Update: {
          book_authors?: string[] | null
          book_cover_image_height?: number | null
          book_cover_image_url?: string | null
          book_cover_image_width?: number | null
          book_description?: string | null
          book_open_library_id?: string
          book_page_count?: number
          book_title?: string
          created_at?: string
          creator_member_id?: number | null
          id?: number
          poll_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_poll_items_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_poll_items_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "public_poll_items_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: number
          member_id: number
          poll_item_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          member_id: number
          poll_item_id: number
        }
        Update: {
          created_at?: string
          id?: number
          member_id?: number
          poll_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_poll_votes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_poll_votes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "public_poll_votes_poll_item_id_fkey"
            columns: ["poll_item_id"]
            isOneToOne: false
            referencedRelation: "poll_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_poll_votes_poll_item_id_fkey"
            columns: ["poll_item_id"]
            isOneToOne: false
            referencedRelation: "poll_items_with_votes"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          club_id: number
          created_at: string
          creator_member_id: number | null
          description: string | null
          editor_member_id: number | null
          end_date: string | null
          id: number
          is_locked: boolean
          name: string
          status: Database["public"]["Enums"]["poll_status"]
          voting_length_days: number
        }
        Insert: {
          club_id: number
          created_at?: string
          creator_member_id?: number | null
          description?: string | null
          editor_member_id?: number | null
          end_date?: string | null
          id?: number
          is_locked?: boolean
          name: string
          status?: Database["public"]["Enums"]["poll_status"]
          voting_length_days?: number
        }
        Update: {
          club_id?: number
          created_at?: string
          creator_member_id?: number | null
          description?: string | null
          editor_member_id?: number | null
          end_date?: string | null
          id?: number
          is_locked?: boolean
          name?: string
          status?: Database["public"]["Enums"]["poll_status"]
          voting_length_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_polls_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club_invite_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_polls_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_polls_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "spreads_count_view"
            referencedColumns: ["club_id"]
          },
          {
            foreignKeyName: "public_polls_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_polls_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "public_polls_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_polls_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
        ]
      }
      posts: {
        Row: {
          author_member_id: number | null
          content: string
          created_at: string
          editor_member_id: number | null
          id: number
          is_spoiler: boolean
          likes_count: number
          reading_id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          author_member_id?: number | null
          content: string
          created_at?: string
          editor_member_id?: number | null
          id?: number
          is_spoiler: boolean
          likes_count?: number
          reading_id: number
          title: string
          updated_at?: string | null
        }
        Update: {
          author_member_id?: number | null
          content?: string
          created_at?: string
          editor_member_id?: number | null
          id?: number
          is_spoiler?: boolean
          likes_count?: number
          reading_id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_member_id_fkey"
            columns: ["author_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_author_member_id_fkey"
            columns: ["author_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "posts_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "posts_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: false
            referencedRelation: "readings"
            referencedColumns: ["id"]
          },
        ]
      }
      readings: {
        Row: {
          book_authors: string[] | null
          book_cover_image_height: number | null
          book_cover_image_url: string | null
          book_cover_image_width: number | null
          book_description: string | null
          book_open_library_id: string
          book_page_count: number
          book_sections: number | null
          book_title: string
          club_id: number
          created_at: string
          creator_member_id: number | null
          editor_member_id: number | null
          id: number
          increment_type: Database["public"]["Enums"]["reading_increment"]
          interval_page_length: number
          interval_section_length: number
          is_archived: boolean
          is_finished: boolean
          join_in_progress: boolean
          section_name: string | null
          start_date: string
        }
        Insert: {
          book_authors?: string[] | null
          book_cover_image_height?: number | null
          book_cover_image_url?: string | null
          book_cover_image_width?: number | null
          book_description?: string | null
          book_open_library_id: string
          book_page_count: number
          book_sections?: number | null
          book_title: string
          club_id: number
          created_at?: string
          creator_member_id?: number | null
          editor_member_id?: number | null
          id?: number
          increment_type?: Database["public"]["Enums"]["reading_increment"]
          interval_page_length?: number
          interval_section_length?: number
          is_archived?: boolean
          is_finished?: boolean
          join_in_progress?: boolean
          section_name?: string | null
          start_date?: string
        }
        Update: {
          book_authors?: string[] | null
          book_cover_image_height?: number | null
          book_cover_image_url?: string | null
          book_cover_image_width?: number | null
          book_description?: string | null
          book_open_library_id?: string
          book_page_count?: number
          book_sections?: number | null
          book_title?: string
          club_id?: number
          created_at?: string
          creator_member_id?: number | null
          editor_member_id?: number | null
          id?: number
          increment_type?: Database["public"]["Enums"]["reading_increment"]
          interval_page_length?: number
          interval_section_length?: number
          is_archived?: boolean
          is_finished?: boolean
          join_in_progress?: boolean
          section_name?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "readings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club_invite_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "readings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "readings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "spreads_count_view"
            referencedColumns: ["club_id"]
          },
          {
            foreignKeyName: "readings_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "readings_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "readings_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "readings_editor_member_id_fkey"
            columns: ["editor_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      club_invite_view: {
        Row: {
          description: string | null
          id: number | null
          name: string | null
          total_members: number | null
        }
        Relationships: []
      }
      members_without_poll_votes: {
        Row: {
          member_id: number | null
          poll_id: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_poll_items_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_items_with_votes: {
        Row: {
          book_authors: string[] | null
          book_cover_image_height: number | null
          book_cover_image_url: string | null
          book_cover_image_width: number | null
          book_description: string | null
          book_open_library_id: string | null
          book_page_count: number | null
          book_title: string | null
          created_at: string | null
          creator_member_id: number | null
          id: number | null
          poll_id: number | null
          votes_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_poll_items_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_poll_items_creator_member_id_fkey"
            columns: ["creator_member_id"]
            isOneToOne: false
            referencedRelation: "members_without_poll_votes"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "public_poll_items_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      post_metadata_view: {
        Row: {
          book_authors: string[] | null
          book_cover_image_height: number | null
          book_cover_image_url: string | null
          book_cover_image_width: number | null
          book_title: string | null
          club_name: string | null
          post_id: number | null
          post_title: string | null
        }
        Relationships: []
      }
      spreads_count_view: {
        Row: {
          club_id: number | null
          total_polls: number | null
          total_readings: number | null
          total_spreads: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      authorize: {
        Args: {
          _user_id: string
          _id: number
          _requested_permission: string
        }
        Returns: boolean
      }
      cls_clubs: {
        Args: {
          _id: number
          _created_at: string
          _creator_user_id: string
        }
        Returns: boolean
      }
      cls_comments: {
        Args: {
          _id: number
          _author_member_id: number
          _post_id: number
          _likes_count: number
          _created_at: string
          _root_comment_id: number
          _replying_to_comment_id: number
        }
        Returns: boolean
      }
      cls_member_interval_progresses: {
        Args: {
          _id: number
          _member_id: number
          _interval_id: number
        }
        Returns: boolean
      }
      cls_member_roles: {
        Args: {
          _id: number
          _member_id: number
        }
        Returns: boolean
      }
      cls_members: {
        Args: {
          _id: number
          _user_id: string
          _club_id: number
          _created_at: string
          _used_club_invite_code: string
        }
        Returns: boolean
      }
      cls_polls: {
        Args: {
          _id: number
          _created_at: string
          _club_id: number
          _end_date: string
          _creator_member_id: number
          _voting_length_days: number
        }
        Returns: boolean
      }
      cls_posts_others: {
        Args: {
          _id: number
          _reading_id: number
          _author_member_id: number
          _title: string
          _content: string
          _likes_count: number
          _created_at: string
        }
        Returns: boolean
      }
      cls_posts_own: {
        Args: {
          _id: number
          _reading_id: number
          _author_member_id: number
          _likes_count: number
          _created_at: string
        }
        Returns: boolean
      }
      cls_readings:
        | {
            Args: {
              _id: number
              _club_id: number
              _start_date: string
              _is_finished: boolean
              _book_open_library_id: string
              _book_title: string
              _book_description: string
              _book_authors: string[]
              _book_page_count: number
              _book_cover_image_url: string
              _book_cover_image_width: number
              _book_cover_image_height: number
              _created_at: string
              _creator_member_id: number
            }
            Returns: boolean
          }
        | {
            Args: {
              _id: number
              _club_id: number
              _start_date: string
              _is_finished: boolean
              _book_open_library_id: string
              _book_title: string
              _book_description: string
              _book_authors: string[]
              _book_page_count: number
              _created_at: string
              _creator_member_id: number
              _increment_type: Database["public"]["Enums"]["reading_increment"]
            }
            Returns: boolean
          }
      get_club_id: {
        Args: {
          _id: number
          table_name: string
        }
        Returns: number
      }
      user_is_member: {
        Args: {
          _user_id: string
          _member_id: number
        }
        Returns: boolean
      }
    }
    Enums: {
      club_permission:
        | "clubs.read"
        | "clubs.update"
        | "club_invite_codes.create"
        | "club_invite_codes.read"
        | "club_invite_codes.delete"
        | "members.read"
        | "members.delete"
        | "member_roles.read"
        | "member_roles.update"
        | "readings.create"
        | "readings.read"
        | "readings.read.all"
        | "readings.update"
        | "readings.delete"
        | "intervals.read"
        | "member_interval_progresses.read"
        | "member_interval_progresses.update.own"
        | "likes.create"
        | "likes.read"
        | "posts.create"
        | "posts.read"
        | "posts.update"
        | "posts.update.own"
        | "posts.delete"
        | "comments.create"
        | "comments.read"
        | "comments.update.own"
        | "comments.delete"
        | "likes.delete.own"
        | "posts.delete.own"
        | "comments.delete.own"
        | "members.delete.own"
        | "member_interval_progresses.delete.own"
        | "member_interval_progresses.create"
        | "likes.create.comment"
        | "likes.create.post"
        | "polls.read"
        | "polls.create"
        | "polls.delete"
        | "polls.update"
        | "poll_items.read"
        | "poll_items.create"
        | "poll_items.delete"
        | "poll_items.delete.own"
        | "poll_votes.create"
        | "poll_votes.delete.own"
        | "polls.read.all"
        | "poll_votes.read"
        | "poll_votes.update.own"
        | "poll_items.create.many"
        | "members.update.own"
      club_role: "member" | "moderator" | "admin"
      poll_status: "selection" | "voting" | "finished" | "archived"
      reading_increment: "pages" | "sections"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

