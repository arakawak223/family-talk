export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          avatar_id: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          avatar_id?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          avatar_id?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      families: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          invite_code: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          invite_code: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          invite_code?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
        };
      };
      question_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          feeling_type: string;
          timing_type: string | null;
          target_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          feeling_type: string;
          timing_type?: string | null;
          target_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          feeling_type?: string;
          timing_type?: string | null;
          target_type?: string | null;
          created_at?: string;
        };
      };
      question_templates: {
        Row: {
          id: string;
          category_id: string;
          question_text: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          question_text: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          question_text?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      voice_messages: {
        Row: {
          id: string;
          family_id: string;
          sender_id: string;
          audio_file_url: string;
          audio_file_size: number | null;
          duration_seconds: number | null;
          question_template_id: string | null;
          custom_question: string | null;
          is_group_message: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          sender_id: string;
          audio_file_url: string;
          audio_file_size?: number | null;
          duration_seconds?: number | null;
          question_template_id?: string | null;
          custom_question?: string | null;
          is_group_message?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          sender_id?: string;
          audio_file_url?: string;
          audio_file_size?: number | null;
          duration_seconds?: number | null;
          question_template_id?: string | null;
          custom_question?: string | null;
          is_group_message?: boolean;
          created_at?: string;
        };
      };
      message_recipients: {
        Row: {
          id: string;
          message_id: string;
          recipient_id: string;
          listened_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          recipient_id: string;
          listened_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          recipient_id?: string;
          listened_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}