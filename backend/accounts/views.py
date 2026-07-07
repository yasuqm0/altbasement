from rest_framework import generics, permissions
from .models import Perfil
from .serializers import RegistroSerializer, PerfilSerializer


class RegistroView(generics.CreateAPIView):
    serializer_class = RegistroSerializer
    permission_classes = [permissions.AllowAny]


class PerfilView(generics.RetrieveAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.perfil
