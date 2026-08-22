from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password as run_password_validators
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email','password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
        }
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value
    
    def validate_password(self, value):
        run_password_validators(value)
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
