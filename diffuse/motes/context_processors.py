from motes.models import Plan

def user_plans(request):
    plans = Plan.objects.filter(user=request.user)
    return {'plans':plans}
